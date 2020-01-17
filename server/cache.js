const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient();
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
    this.queryCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    function process(query) {
        return query.collection + "_" + (query.hasOwnProperty('username') ? query.username : query._id);
    }

    if (!this.queryCache) {
        return exec.apply(this, arguments);
    }

    const key = process(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    const cacheValue = await client.get(key);
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) 
            ? doc.map(d => new this.model(d)) 
            : new this.model(JSON.parse(cacheValue));
    }
    
    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    return result;
}