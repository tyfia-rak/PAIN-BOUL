<<<<<<< HEAD
# Next.js & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/heroui/next-app-template)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).

## Configuration (Database & Auth)

Add a `.env.local` file in the `pain-boule` folder with:

```bash
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

NEXTAUTH_SECRET=replace_with_a_strong_random_string
NEXTAUTH_URL=http://localhost:3000
```

Ensure your MySQL database has a `user` table with at least these columns:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR) — bcrypt hash
- `name` (VARCHAR, optional)
- `role` (ENUM or VARCHAR) — e.g. `admin`, `user`

To create an admin user, first generate a bcrypt hash for your password (example via Node.js):

```bash
node -e "(async()=>{const bcrypt=require('bcryptjs');const h=await bcrypt.hash('admin123',10);console.log(h)})();"
```

Then insert the user with that hash:

```sql
INSERT INTO user (email, password, name, role)
VALUES ('admin@example.com', '<paste_bcrypt_hash_here>', 'Admin', 'admin');
```

After setting env vars and creating a user, run the dev server and log in via `/admin/login`.
=======
# PAIN-BOUL
creation d'un site vitrine
>>>>>>> 6a985ac745836d2620aaa5c9ba7ef20e8041b6a6
