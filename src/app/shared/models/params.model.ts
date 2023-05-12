export interface Errors {
  errors: Error[];
}

// Error represents a json error response.
// See https://jsonapi.org/format/#error-objects.
export interface Error {
  id?: string;
  links?: any;
  status?: string;
  code?: string;
  detail?: string;
  source?: any;
  meta?: any;
}

// ResponseJSON represents a response in JSON format, losely according to
// jsonapi.org.
export interface ResponseJSON {
  // The data of the primary object.
  data?: any;

  // If Errors is set, Data must be empty and vice versa.
  errors?: any;

  // Other data items that are included in the response but not part of the
  // originally requested object. Most commonly this includes other objects
  // the primary object is related to.
  // Each object should have at least the fields "id", "type" and
  // "attributes".
  included?: any;

  // Links for the query itself. Usually includes a "self" link. Other
  // examples are "prev" and "next" links for paginated list requests.
  links?: any;
}

export interface ResourceID {
  id: string;
  type: string;
}

export interface SelfLink {
  self: string;
}

export interface RelatedLink {
  related: string;
}

export interface Links extends SelfLink, RelatedLink {}

/*
See https://jsonapi.org/format/#document-resource-object-linkage for resource
linkage.
*/

// RelatedResource allows linking resource identifiers objects that are related
// to the main resource. There should be a non-empty to one relationship between
// the main resource(s) and the related resource.
//
// All resources specified in a "Data" field of a RelatedResource should also
// be provided under a top-level "Included" field, as explained in the
// jsonapi.org specification.
export interface RelatedResource {
  links: Links;
  data: ResourceID;
}

// RelatedResource allows linking resource identifiers objects that are related
// to the main resource. There should be a non-empty to one relationship between
// the main resource(s) and the related resource.
//
// All resources specified in a "Data" field of a RelatedResource should also
// be provided under a top-level "Included" field, as explained in the
// jsonapi.org specification.
export interface RelatedResources {
  links: Links;
  data: ResourceID[];
}

// RelatedResourceLinks can be used to specify links to resources that are
// related to the main resource. It represents the same as the Links field
// in the RelatedResource structs, except that the related resources need not
// be included separately under the "Included" field.
export interface RelatedResourceLinks {
  links: Links;
}

// Timestamp models timestamp fields found in the databases
export interface Timestamp {
  created_at: Date;
  updated_at: Date;
}

// Pagination handling
export interface PaginationParams {
  after?: string;
  before?: string;
  limit?: number;
}

export interface PaginationLinks {
  prev?: string;
  next?: string;
}

export const PAGINATION = {
  LIMIT: 20
};
