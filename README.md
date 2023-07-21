# TECHNICAL TEST Backend

## Installation

pastikan node_modules sudah terinstal atau instal menggunakan

#### `npm instal`

atau

#### `yarn`

instal sequelize-cli

#### `npx sequelize init`

## Database

pastikan nama database sama dengan yang ada di folder config file config.json

```python
  "development": {
    "username": "root",
    "password": null,
    "database": "database_",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```

buat tabel di database menggunakan cli dari sequelize

#### `npx sequelize db:migrate`

## Running

jalankan dengan cli

#### `npm run dev`

atau

#### `yarn dev`

jika terjadi error bisa menggunakan

#### `node index.js`

## Pengguan API

| Parameter     | Parameter                                                       |
| :------------ | :-------------------------------------------------------------- |
| /api/register | {nama,email,password} format json                               |
| /api/login    | {email,password} format json                                    |
| /api/me       | mencari dengan menggunakan Token (Pastikan Bearer token terisi) |
