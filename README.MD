# OP Codespace

On premise codespaces.

Extension of [Rio](https://rio.io/)

## Config file

You can add a file into the root of your git repository to configure your IDE environment.
You can install VSCode extensions and add sequence of scripts to execute at initialisation.

Create a file named `op-codespace.json` at the root of your repository.

Example of op-codespace.json:
```json
{
    "extensions": [
        "doggy8088.angular-extension-pack",
        "njpwerner.autodocstring"
    ],
    "scripts": [
        "sudo apt-get install -y --no-install-recommends wget",
        "wget https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && sudo dpkg -i packages-microsoft-prod.deb",
        "sudo add-apt-repository universe",
        "sudo apt-get update",
        "sudo apt-get install -y apt-transport-https",
        "sudo apt-get update",
        "sudo apt-get install -y dotnet-sdk-3.1"
    ]
}
```

## API

* List: `/api/codespace`
* Create: `/api/codespace/create?password=12345&github=https://github.com/gilsdav/sail-hub.git&name=sail-hub`
* Delete: `/api/codespace/delete?name=sail-hub`
