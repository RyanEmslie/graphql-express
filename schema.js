const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");

// User Type - JSONPlaceholder
const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		username: { type: GraphQLString },
		city: { type: GraphQLString },
		company: { type: GraphQLString },
		catchphrase: { type: GraphQLString }
	})
});

// Customer Type
const CustomerType = new GraphQLObjectType({
	name: "Customer",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt }
	})
});

// Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios
					.get("http://localhost:3000/customers/" + args.id)
					.then(res => res.data);
			}
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args) {
				return axios
					.get("http://localhost:3000/customers/")
					.then(res => res.data);
			}
		},
		user: {
			type: UserType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios
					.get("https://jsonplaceholder.typicode.com/users" + args.id)
					.then(res => res.data);
			}
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios
					.get(`https://jsonplaceholder.typicode.com/users`)
					.then(res => res.data);
			}
		}
	}
});

// Mutations
const mutation = new GraphQLObjectType({
	name: "Mutations",
	fields: {
		addCustomer: {
			type: CustomerType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parentValue, args) {
				return axios
					.post("http://localhost:3000/customers", {
						name: args.name,
						email: args.email,
						age: args.age
					})
					.then(res => res.data);
			}
		},
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, args) {
				return axios
					.delete("http://localhost:3000/customers/" + args.id)
					.then(res => res.data);
			}
		},
		editCustomer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLString },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				age: { type: GraphQLInt }
			},
			resolve(parentValue, args) {
				return axios
					.patch("http://localhost:3000/customers/" + args.id, args)
					.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});
