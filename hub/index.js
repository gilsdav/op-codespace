// @ts-check
const k8s = require('@kubernetes/client-node');
const express = require('express');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

let config = kc.exportConfig();
// fix config
const parsedConfig = JSON.parse(config);
const tokenFile = parsedConfig.users[0].user['auth-provider'].config.tokenFile;
parsedConfig.users[0].user.tokenFile = tokenFile;
parsedConfig.users[0].user['auth-provider'] = undefined;
// fix config end
config = JSON.stringify(parsedConfig);

fs.writeFileSync('kubeconfig.json', config);

const app = express();
const port = 80;

function mapStatus(status) {
    return {
        name: status.computedApp,
        available: status.scaleStatus && status.scaleStatus.available > 0,
        url: status.appEndpoints[0]
    };
}

app.get('/api/codespace', (req, res) => {
    const result = execSync('rio --kubeconfig=kubeconfig.json -n codespace ps --format json').toString().replace('}\n\n{', '},\n{');
    const parsedResult = JSON.parse(`[${result}]`);
    res.send(parsedResult.map(res => mapStatus(res.Obj.status)));
});

app.get('/api/codespace/create', (req, res) => {
    const password = req.query.password;
    const github = req.query.github;
    const name = req.query.name;
    if (github && password && name) {
        const command = `rio -n codespace run -n ${name} -p 8080 -e GITHUB_REPOSITORY=${github} -e PASSWORD=${password} gilsdav/op-codespace`;
        const serviceName = execSync(command).toString().replace('\n', '');
        let index = 0;
        const interv = setInterval(() => {
            const infos = execSync(`rio inspect --format json ${serviceName}`).toString();
            const parsedInfos = JSON.parse(infos);
            if ((parsedInfos.status && parsedInfos.status.deploymentReady) || index > 10) {
                clearInterval(interv);
                res.send(mapStatus(parsedInfos.status));
            }
        }, 3000);
    } else {
        res.sendStatus(400);
    }
});

app.get('/api/codespace/delete', (req, res) => {
    const name = req.query.name;
    if (name) {
        const command = `rio -n codespace rm ${name}`;
        try {
            execSync(command);
            res.send();
        } catch (e) {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
