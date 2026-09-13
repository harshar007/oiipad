"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonGameProfileRepository = void 0;
const domain_1 = require("@oiipad/domain");
class JsonGameProfileRepository {
    profiles = new Map();
    constructor() {
        // Register default game profiles
        const bbr1 = domain_1.GameProfile.bbr1();
        const bbr2 = domain_1.GameProfile.bbr2();
        const standard = domain_1.GameProfile.standard();
        this.profiles.set(bbr1.id.value, bbr1);
        this.profiles.set(bbr2.id.value, bbr2);
        this.profiles.set(standard.id.value, standard);
    }
    async getById(id) {
        return this.profiles.get(id.value);
    }
    async getAll() {
        return Array.from(this.profiles.values());
    }
    async save(profile) {
        this.profiles.set(profile.id.value, profile);
    }
}
exports.JsonGameProfileRepository = JsonGameProfileRepository;
//# sourceMappingURL=JsonGameProfileRepository.js.map