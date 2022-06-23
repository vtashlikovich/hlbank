var faker = require('@withshepherd/faker');

module.exports = {
    generateRandomData
}

function generateRandomData (context, events, done) {
    context.vars.party_account_number = faker.fake('{{finance.account}}');
    context.vars.party_bic = faker.fake('{{finance.bic}}');
    context.vars.party_iban = faker.fake('{{finance.iban}}');
    context.vars.party_bank_country = faker.fake('{{address.countryCode}}');
    context.vars.party_name = faker.fake('{{name.findName}}');
    context.vars.party_country = faker.fake('{{address.countryCode}}');
    context.vars.party_zipcode = faker.fake('{{address.zipCode}}');
    context.vars.party_city = faker.fake('{{address.city}}');
    context.vars.party_contact = faker.fake('{{name.findName}}');
    context.vars.party_phone = faker.fake('{{phone.phoneNumber}}');
    context.vars.party_email = faker.fake('{{internet.email}}');
    context.vars.description = faker.fake('{{finance.transactionDescription}}');

    return done()
}