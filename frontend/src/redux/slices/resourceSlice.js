import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/v1/users";

export const resourceApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {
			getResources: builder.query({
				query() {
					return {
						url: `${USERS_URL}/resources`,
						method: "GET",
					};
				},
				providesTags: ["Resource"],
			}),
			getResourcesByLevel: builder.query({
				query(level) {
					const encoded = level === "telegram" ? "telegram" : encodeURIComponent((level || "").replace(/ /g, " "));
					return {
						url: `${USERS_URL}/${encoded}/resources/`,
						method: "GET",
					};
				},
				providesTags: (result, error, level) => [{ type: "Resource", id: `level-${level}` }],
			}),
			search: builder.query({
				query({ filter, value }) {
					return {
						url: `${USERS_URL}/search?filter=${encodeURIComponent(filter)}&value=${encodeURIComponent(value)}`,
						method: "GET",
					};
				},
				providesTags: (result, error, { filter, value }) => [{ type: "Resource", id: `search-${filter}-${value}` }],
			}),
		};
	},
});

export const {
	useGetResourcesQuery,
	useGetResourcesByLevelQuery,
	useSearchQuery,
} = resourceApiSlice;
