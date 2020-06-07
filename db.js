const faker = require('faker');

module.exports = () => {
    const data = { student: [] };

    // 生成200个学生信息
    for (let i = 0; i < 200; i++) {
        let s = {
            id: `${Date.now()}@${i}@${faker.random.uuid()}`,
            name: faker.name.findName(),
            age: faker.random.number({ min: 5, max: 35 }),
            address: faker.address.streetAddress()
        };
        data.student.push(s);
    }

    return data
}