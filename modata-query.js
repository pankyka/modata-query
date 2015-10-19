"use strict";

angular
    .module("MODataQuery", [])
    .factory("MODataQuery", function () {

    function parseValue(value) {
        if (!isNaN(Date.parse(value))) {
            return new Date(value).toISOString();
        } else {
            return value;
        }
    }

    function parseFilter(filter) {
        let query = {};
        if (filter.logic) {
            // todo other mongo logic
            let logic = filter.logic === "and" ? "$and" : "$or";
            query[logic] = [];
            for (let subFilter of filter.filters) {
                query[logic].push(parseFilter(subFilter));
            }
        } else {
            query[filter.field] = {};
            // todo other mongo query operator
            switch (filter.operator) {
                case "eq":
                    query[filter.field].$eq = parseValue(filter.value);
                    break;
                case "neq":
                case "ne":
                    query[filter.field].$ne = parseValue(filter.value);
                    break;
                case "lt":
                    query[filter.field].$lt = parseValue(filter.value);
                    break;
                case "lte":
                    query[filter.field].$lte = parseValue(filter.value);
                    break;
                case "gt":
                    query[filter.field].$gt = parseValue(filter.value);
                    break;
                case "gte":
                    query[filter.field].$gte = parseValue(filter.value);
                    break;
                case "startswith":
                    query[filter.field].$regex = new RegExp("^" + filter.value, "i").toString();
                    query[filter.field].$options = "i";
                    break;
                case "endswith":
                    query[filter.field].$regex = new RegExp(filter.value + "$", "i").toString();
                    query[filter.field].$options = "i";
                    break;
                case "contains":
                    query[filter.field].$regex = new RegExp(filter.value, "i").toString();
                    query[filter.field].$options = "i";
                    break;
            }
        }

        return query;
    }

    function MODataQuery(options) {
        let mongooseQuery = {};

        // paging
        if (!isNaN(options.skip) && !isNaN(options.take)) {
            mongooseQuery.sk = options.skip;
            mongooseQuery.l = options.take;
            mongooseQuery.ic = true;
        }

        // sorting
        if (options.sort) {
            let sorting = {};
            for (let sort of options.sort) {
                sorting[sort.field] = sort.dir === "asc" ? 1 : -1;
            }
            if (!_.isEmpty(sorting)) mongooseQuery.s = sorting;
        }

        // filtering
        if (options.filter) {
            mongooseQuery.q = parseFilter(options.filter);
        }

        // todo grouping/aggregate

        return mongooseQuery;
    }

    return MODataQuery;
});