import { AuthRepository } from "../repositories/auth.repository";
import { AuthStore } from "../stores/auth.store";

class AuthController {
    private authRepo: AuthRepository;
    private authStore: AuthStore;

    constructor() {
        this.authRepo = new AuthRepository();
        this.authStore = new AuthStore();
    }
}