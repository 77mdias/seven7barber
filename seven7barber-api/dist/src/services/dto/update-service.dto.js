"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceSchema = void 0;
const zod_1 = require("zod");
exports.UpdateServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().min(15).optional(),
    price: zod_1.z.number().min(0).optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=update-service.dto.js.map