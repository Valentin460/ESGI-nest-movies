import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {
    console.log('Service email initialisé');
  }

  async sendEmailValidation(email: string, token: string) {
    console.log('\n========================================');
    console.log('VALIDATION EMAIL');
    console.log('========================================');
    console.log(`A: ${email}`);
    console.log(`Sujet : Valider votre adresse email`);
    console.log(`\nTOKEN DE VALIDATION : ${token}`);
    console.log('\nUtilisez votre jeton dans le POST /auth/verify-email');
    console.log('========================================\n');
  }

  async send2FACode(email: string, code: string) {
    console.log('\n========================================');
    console.log('CODE AUTHENTIFICATION');
    console.log('========================================');
    console.log(`A: ${email}`);
    console.log(`Sujet : Your 2FA Login Code`);
    console.log(`\nCODE 2FA : ${code}`);
    console.log('\nUtilisez votre jeton dans le POST /auth/verify-2fa');
    console.log('Ce code expire dans 10 minutes');
    console.log('========================================\n');
  }
}
