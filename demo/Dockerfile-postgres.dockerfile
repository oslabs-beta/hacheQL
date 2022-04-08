FROM postgres:14.2
COPY ./server/mydb.sql /docker-entrypoint-initdb.d/
