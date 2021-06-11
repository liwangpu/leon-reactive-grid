const faker = require('faker');

module.exports = () => {
    const data = { users: [], companies: [] }
    // 创建一些初始数据
    for (let i = 0; i < 300; i++) {
        data.users.push({ id: faker.datatype.uuid(), name: faker.name.findName(), age: faker.datatype.number({ min: 5, max: 20 }), info: faker.lorem.words(20) });
    }
    for (let i = 0; i < 200; i++) {
        data.companies.push({ id: faker.datatype.uuid(), name: faker.company.companyName() });
    }

    return data;
}