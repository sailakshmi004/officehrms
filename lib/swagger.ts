import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRMS API",
      version: "1.0.0",
      description: "API for HRMS",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token for API authentication",
        },
        apiKey: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API Key for authentication",
        },
      },
      schemas: {
        Employee: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Employee unique identifier",
            },
            name: {
              type: "string",
              example: "John Doe",
              description: "Employee full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "Employee email address",
            },
            employeeCode: {
              type: "string",
              example: "EMP001",
              description: "Unique employee code",
            },
            password: {
              type: "string",
              example: "hashedPassword123",
              description: "Hashed employee password",
            },
            joiningDate: {
              type: "string",
              format: "date",
              example: "2026-01-15",
              description: "Employee joining date (YYYY-MM-DD)",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "RESIGNED"],
              example: "ACTIVE",
              description: "Employee status",
            },
            deptId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "Department ID (optional)",
            },
            roleId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "Role ID (optional)",
            },
            managerId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "Manager ID (optional)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Record creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Record last update timestamp",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app/api/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
