ARG NODE_VERSION=16-alpine3.12

FROM node:${NODE_VERSION}

LABEL name="invoice-app"
LABEL license="MIT"
LABEL description="INVOICE APP"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

RUN addgroup --system invoice \
    && adduser --system --ingroup invoice invoice

COPY package*.json ./

RUN npm install

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD [ "npm", "run", "dev" ]