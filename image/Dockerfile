FROM codercom/code-server:latest

RUN sudo apt-get update

RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN mkdir workspace

COPY ./run.sh ./config-executor.js ./

ENTRYPOINT ["sh", "run.sh"]
