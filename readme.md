# modata-query 

Angular 1.x service for [MOData npm package](https://www.npmjs.com/package/modata)

Simplified query syntax for Mongoose/MongoDB query. This syntax is equal to [kendo.DataSource filtering](http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#configuration-filter).

```
{
    skip: 0,
    take: 10,
    filter: {
        filters: [
            { field: "field1", operator: "contains", value: "1234" },
            { 
                filters: [
                    { field: "field2", operator: "gte", value: "2015-10-01" },
                    { field: "field2", operator: "lte", value: "2015-10-31" }
                ],
                logic: "or"
            }
        ],
        logic: "and"
    },
    sort: {
        { field: "field1', dir: "desc" }
    }
}
```

become:

```
{
    sk: 0,
    l: 10,
    ic: true,
    s: { "field1": -1 },
    q: {
        "$and": [
            { "field1": {"$regex":"/1234/i","$options":"i"}},
            { "$or": [
                {"field2":{"$gte":"2015-09-30T22:00:00.000Z"}},
                {"field2":{"$lte":"2015-10-30T23:00:00.000Z"}}
                ]
            }
        ]
    }
}
```

You can use with Angular $resource to get the query string:

```
var User = $resource('/user/:userId', {userId:'@id'});
var found = User.query(MODataquery(filter));
```