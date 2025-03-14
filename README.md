# Nexora Frontend

> **Nexora** - from the Latin _"nexus"_ meaning "connection" or "link", and the
> Galician _"ora"_ meaning "now". A name that reflects seamless, real-time
> interactions.

#### This repository is the frontend module of the Nexora project.

## 📌 About Nexora

Nexora is a **real-time social networking and chat platform** built for my
university final paper assignment.

It combines social media features with a messaging system, focusing on
**real-time data synchronization** and **functional programming** to enhance
performance and maintainability.

It provides a modern, interactive social experience while avoiding unnecessary
page refreshes.

## 🚀 Features

- **User Authentication** (Email + Password, Google)
- **Post Creation** (Text-based posts)
- **Friend System** (Send/accept friend requests)
- **Like & Comment** (Engage with posts in real-time)
- **Privacy Controls** (Control who can see or interact with your
  posts/messages)
- **Real-time Messaging** (Chat with friends instantly)
- **Full Real-time Support** (No manual refresh needed)

---

<details>
	<summary>
		<h2>
			Technologies used
		</h2>
	</summary>

### Build Tools

- Language: **Typescript**
- JS Runtime: **bun** (recommended, though it should also work with **Node.js**)
- Frontend Build Tool: **Vite**

### Frameworks

- Frontend Framework: **React**
- CSS Framework: **Tailwind CSS**

### Libraries

- Components: **shadcn/ui**
- Routing: **React Router**

### Dev Tools

- Linting: **ESLint**
- Formatting: **Prettier**

</details>

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone
```

2. Install dependencies:

```bash
bun i
```

or

```bash
npm i
```

3. Start the development server:

```bash
bun dev
```

or

```bash
npm run dev
```

## ℹ Git commit message conventions

The commits in this repo are organized using the following format:

```
<type>(<scope>): <subject>
```

The type represents the type of change being made, the scope represents the
affected module, and the subject is a brief description of the change.

The available types are: `feat`, `fix`, `docs`, `style`, `refactor`, `test`,
`deps`, and `chore`.

Examples:

- `feat(auth): add Google authentication`
- `fix(posts): fix post creation bug`
- `docs(readme): update installation instructions`
- `deps: install Tailwind CSS`

## 📜 License

This project is licensed under the **MIT License**.

---

🔧 _Nexora is in active development - contributions and feedback are welcome!_
🚀
