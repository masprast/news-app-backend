# news-app-backend

Ini adalah repoiroti dalam rangka pre-test proses rekrutmen untuk posisi backend developer.

### Route

Route yang tersedia untuk API ini sebagai berikut:
|endpoint|method|keterangan|
|----|----|----|
|_/_|`GET`|halaman awal/root|
|_/login_|`POST`|login user|
|_/:username_|`GET`|detail user|
|_/user_|`GET`|list user|
|_/user_|`POST`|create user|
|_/user/:username_|`PUT`|update user|
|_/user/:username_|`DELETE`|delete user
|_/logout_|`POST`|logout user|
|_/news_|`GET`|list and search news|
|_/news_|`POST`|create news|
|_/news/:id_|`GET`|detail news|
|_/news/:id_|`PUT`|update news|
|_/news/:id_|`DELETE`|delete news|
|_/category_|`GET`|list category|
|_/category_|`POST`|create category|
|_/category/:id_|`GET`|detail category|
|_/category/:id_|`PUT`|update category|
|_/category/:id_|`DELETE`|delete category|

### Pre-requisities

1. Docker compose
2. NPM

### Tech-stack

1. Typescript - Language
2. PostgreSQL - DB
3. Express - HTTP server
4. Prisma - ORM
5. Docker - container

### Langkah-langkah

1. clone repo dari github akun penulis

   ```sh
   git clone https://github.com/masprast/news-app-backend.git
   cd news-app-backend
   ```

2. lalu install dependency
   ```
   npm i
   ```
3. jalankan DB PostgreSQL dalam container dengan perintah `docker-compose up -d`
4. setelah kontainer database berjalan, langkah selanjutnya adalah membuat tabel. Di sini penulis menggunakan module _prisma_
   ```sh
   npx prisma generate
   npx prisma db push
   ```

### Pengetesan

Sejauh ini penulis hanya mampu melakukan pengetesan untuk login, dengan _output_ seperti berikut:

```json
{
	"user": {
		"id": "46569578-130d-4061-9248-5bddf95192ce",
		"email": "thespecialone@admin",
		"username": "thespecialone@admin",
		"role": "ADMIN"
	},
	"token": {
		"access": {
			"token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NjU2OTU3OC0xMzBkLTQwNjEtOTI0OC01YmRkZjk1MTkyY2UiLCJpYXQiOjE3MzA2NDExNzQwMDAsImV4cCI6MTczMDY2NjM3NDAwMCwidHlwZSI6IkFDQ0VTUyJ9.lj6P8rYuBKZTIsDKaMNUIN6wQI8_Kspy0NPhlPIMAoQ",
			"expires": "2024-11-03T13:39:34.568Z"
		},
		"refresh": {
			"token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NjU2OTU3OC0xMzBkLTQwNjEtOTI0OC01YmRkZjk1MTkyY2UiLCJpYXQiOjE3MzA2NDExNzQwMDAsImV4cCI6MTczMDY2NjM3NDAwMCwidHlwZSI6IlJFRlJFU0gifQ.qm-p7Jaxb9f1J9VVU649pp0D4tL2w3F-EwXFyaKZo1s",
			"expires": "2024-11-03T13:39:34.576Z"
		}
	}
}
```

Tapi, entah mengapa saat melakukan pengetesan untuk **RBAC** (Role Based Access Control) dengan menggunakan _middleware_, _express_ tiba-tiba _not responding_ sehingga terjadi _error CONNECTION REFUSED_, sehingga tidak dapat melakukan pengujian selanjutnya.
