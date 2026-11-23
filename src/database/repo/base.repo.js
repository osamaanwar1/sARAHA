
export default (model) => {

    return {

        // CREATE
        create: async function ({ data, options = {} }) {
            return await model.create(data, options);
        },

        insertMany: async function ({ data, options = {} }) {
            return await model.insertMany(data, options);
        },

        // READ
        find: async function ({
                                  filter = {},
                                  projection = {},
                                  options = {}
                              }) {
            return await model.find(filter, projection, options);
        },

        findOne: async function ({
                                     filter = {},
                                     projection = {},
                                     options = {}
                                 }) {
            return await model.findOne(filter, projection, options);
        },

        findById: async function ({
                                      id,
                                      projection = {},
                                      options = {}
                                  }) {
            return await model.findById(id, projection, options);
        },

        // UPDATE
        findOneAndUpdate: async function ({
                                              filter = {},
                                              updates = {},
                                              options = {}
                                          }) {
            return await model.findOneAndUpdate(
                filter,
                updates,
                {
                    returnDocument: "after",
                    ...options
                }
            );
        },

        findByIdAndUpdate: async function ({
                                               id,
                                               updates = {},
                                               options = {}
                                           }) {
            return await model.findByIdAndUpdate(
                id,
                updates,
                {
                    returnDocument: "after",
                    ...options
                }
            );
        },

        updateOne: async function ({
                                       filter = {},
                                       updates = {},
                                       options = {}
                                   }) {
            return await model.updateOne(filter, updates, options);
        },

        updateMany: async function ({
                                        filter = {},
                                        updates = {},
                                        options = {}
                                    }) {
            return await model.updateMany(filter, updates, options);
        },

        // DELETE
        deleteOne: async function ({ filter = {} }) {
            return await model.deleteOne(filter);
        },

        deleteMany: async function ({ filter = {} }) {
            return await model.deleteMany(filter);
        },

        findOneAndDelete: async function ({
                                              filter = {},
                                              options = {}
                                          }) {
            return await model.findOneAndDelete(filter, options);
        },

        findByIdAndDelete: async function ({
                                               id,
                                               options = {}
                                           }) {
            return await model.findByIdAndDelete(id, options);
        },

        // COUNT
        countDocuments: async function ({ filter = {} }) {
            return await model.countDocuments(filter);
        },

        exists: async function ({ filter = {} }) {
            return await model.exists(filter);
        },

        // PAGINATION
        pagination: async function ({
                                        filter = {},
                                        page = 1,
                                        limit = 10,
                                        sort,
                                        populate,
                                        projection = {}
                                    }) {
            page = Math.max(1, Number(page) || 1);
            limit = Math.max(1, Number(limit) || 10);

            const skip = (page - 1) * limit;

            let query = model.find(filter, projection)
                .skip(skip)
                .limit(limit);

            if (sort) query = query.sort(sort);

            if (populate) query = query.populate(populate);

            const [data, totalCount] = await Promise.all([
                query.exec(),
                model.countDocuments(filter)
            ]);

            return {
                data,
                pagination: {
                    totalCount,
                    currentPage: page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
                }
            };
        }

    };
};
