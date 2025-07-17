# Blog with Express and Template Engine

![alt text](/public/images/readme-img-01.png)

This project demonstrates the process of converting a static HTML theme into a dynamic, data-driven website with a full-featured admin panel using Express.js and the Nunjucks template engine. It was developed as a practical exercise for the Advanced Web Development course at Spiced Academy (AWD25).

The core challenge was to take the static "Clean Blog" theme and "re-package" it into a modular and maintainable structure. This involved breaking down the original HTML into reusable components (layouts, partials, and macros) and dynamically generating the blog posts from a central JSON data source.

![alt text](/public/images/readme-img-02.png)

## Core Features & Concepts

- **Dynamic Public Blog**: Server-rendered posts from a JSON data source with clean, slug-based URLs, built on a modular frontend using template inheritance and macros.
- **Full-Featured Admin Panel**: Manage all content with complete CRUD operations. Features a Quill.js rich text editor, image management, real-time search, and a clean, sequential ID system.
- **Robust Backend Architecture**: Built with TypeScript following a modular MVC (Model-View-Controller) pattern, ensuring a clean separation of concerns (data logic, routing, and presentation). The admin panel communicates via a REST-like API, handling asynchronous form submissions with the fetch API.

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Templating**: Nunjucks
- **Frontend**: HTML5, Tailwind CSS (Admin), Bootstrap (Blog), Vanilla JS
- **Tools & Libraries**: Quill.js, Nodemon, Font Awesome
