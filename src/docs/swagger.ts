import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API BukaToko",
        description: "Dokumentasi API BukaToko",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://sanberbe61-deadania.vercel.app/api",
            description: "Production Server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                email: "joni2024@yopmail.com",
                password: "123412341",
            },
            RegisterRequest: {
                fullName: "joni joni",
                username: "joni2024",
                email: "joni2024@yopmail.com",
                password: "123412341",
                confirmPassword: "123412341",
                roles: ["user"],
            },
            UpdateProfileRequest: {
                fullName: "joni joni",
                username: "joni2024",
                email: "joni2024@yopmail.com",
                password: "123412341",
                confirmPassword: "123412341",
                role: "user",
            },
            CreateCategory: {
                name: "Fashion Female"
            },
            CreateProduct: {
                name: "Abaya import",
                description: "Deskripsi gamis variant terbaru",
                category: "672cc50ebb8bb89e108ce5f6",
                slug: "abaya-import",
                qty: 100,
                price: 2000
            },
            CreateOrder: {
                grandTotal: 0,
                orderItems: [
                    {
                        productId: "672e1e5758d68660a938d21d",
                        name: "Abaya Gamis Import",
                        price: 100000,
                        quantity: 1
                    }
                ]
            },

        },
    },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);