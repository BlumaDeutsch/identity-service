const crypto = require('crypto');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Generates a plain-text API key, hashes it with bcrypt, and returns both.
 */
async function generateApiKey() {
    const plain = crypto.randomBytes(32).toString('hex');
    const hash  = await bcrypt.hash(plain, SALT_ROUNDS);
    return { plain, hash };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('projects').del();

    // Generate all keys upfront so we can log them before inserting
    const keys = {
        mainWebsite:        await generateApiKey(),
        mobileApp:          await generateApiKey(),
        internalDashboard:  await generateApiKey(),
        legacyApi:          await generateApiKey(),
    };

    // ⚠️  These plain keys are shown ONCE here — they are not stored in the DB.
    //     Save them somewhere safe (e.g. .env, a secrets manager).
    console.log('\n========== PLAIN API KEYS (save these now) ==========');
    console.log('Main Website:       ', keys.mainWebsite.plain);
    console.log('Mobile App:         ', keys.mobileApp.plain);
    console.log('Internal Dashboard: ', keys.internalDashboard.plain);
    console.log('Legacy API:         ', keys.legacyApi.plain);
    console.log('=====================================================\n');

    await knex('projects').insert([
        {
            name: 'Main Website',
            description: 'The company public-facing website and landing pages.',
            is_active: true,
            api_key: keys.mainWebsite.hash,
            last_used_at: new Date('2024-05-10T08:30:00Z'),
        },
        {
            name: 'Mobile App',
            description: 'iOS and Android consumer application.',
            is_active: true,
            api_key: keys.mobileApp.hash,
            last_used_at: new Date('2024-06-01T14:00:00Z'),
        },
        {
            name: 'Internal Dashboard',
            description: 'Analytics and operations dashboard for internal teams.',
            is_active: true,
            api_key: keys.internalDashboard.hash,
            last_used_at: null,
        },
        {
            name: 'Legacy API',
            description: 'Deprecated v1 API — kept for backward compatibility.',
            is_active: false,
            api_key: keys.legacyApi.hash,
            last_used_at: new Date('2023-12-15T09:00:00Z'),
        },
    ]);
};