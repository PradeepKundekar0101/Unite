#!/bin/sh


cd /app/packages/db

npx prisma migrate deploy

cd /app/apps/api-server


node dist/index.js