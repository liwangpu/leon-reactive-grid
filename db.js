const faker = require('faker');

module.exports = () => {
    const data = { student: [] };

    // 生成200个学生信息
    for (let i = 0; i < 200; i++) {
        let s = {
            id: `${Date.now()}@${i}@${faker.random.uuid()}`,
            name: faker.name.findName(),
            age: faker.random.number({ min: 5, max: 35 }),
            country: faker.address.country(),
            city: faker.address.city(),
            address: faker.address.streetAddress(),
            department: faker.commerce.department(),
            color: faker.commerce.color(),
            remark: faker.random.words()
        };
        data.student.push(s);
    }

    return data
}