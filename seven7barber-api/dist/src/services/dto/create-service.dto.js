"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceSchema = void 0;
const zod_1 = require("zod");
exports.CreateServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().min(15, 'Duration must be at least 15 minutes'),
    price: zod_1.z.number().min(0, 'Price must be a positive number'),
});
//# sourceMappingURL=create-service.dto.js.map