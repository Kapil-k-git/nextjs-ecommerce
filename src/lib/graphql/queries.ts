
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
query GetProducts(
  $first: Int
  $channel: String
  $filter: ProductFilterInput
  $sortBy: ProductOrder
) {
  products(first: $first, channel: $channel, filter: $filter, sortBy: $sortBy) {
  edges {
      node {
        id
        name
        slug
        defaultVariant {
          id
          name
          sku
        }
        media {
          url
        }
      }
    }
}
}
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID, $slug: String, $channel: String) {
    product(id: $id, slug: $slug, channel: $channel) {
      id
      name
      channel
      description
      seoTitle
      seoDescription
      defaultVariant {
        id
        name
        sku
        pricing {
          priceUndiscounted {
            gross {
              amount
              currency
            }
          }
          price {
            gross {
              amount
              currency
            }
          }
        }
      }
      variants {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            id
            name
          }
          values {
            id
            name
          }
        }
      }
      media {
        id
        url
        alt
        type
      }
      attributes {
        attribute {
          id
          name
        }
        values {
          id
          name
        }
      }
      category {
        id
        name
        slug
      }
      productType {
        id
        name
      }
      isAvailableForPurchase
      availableForPurchase
    }
  }
`;

export const GET_ATTRIBUTES = gql`
  query GetAttributes($first: Int) {
    attributes(first: $first) {
      edges {
        node {
          id
          name
          slug
          inputType
          choices(first: 10) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CHECKOUT = gql`
  query GetCheckout($id: ID!) {
    checkout(id: $id) {
      id
      token
      totalPrice {
        gross {
          amount
          currency
        }
      }
      subtotalPrice {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      lines {
        id
        quantity
        variant {
          id
          name
          product {
            id
            name
            slug
            thumbnail {
              url
            }
          }
          pricing {
            price {
              gross {
                amount
                currency
              }
            }
          }
        }
      }
      shippingAddress {
        id
        firstName
        lastName
        streetAddress1
        city
        countryArea
        postalCode
        country {
          code
        }
      }
      billingAddress {
        id
        firstName
        lastName
        streetAddress1
        city
        countryArea
        postalCode
        country {
          code
        }
      }
      availableShippingMethods {
        id
        name
        price {
          amount
          currency
        }
      }
    }
  }
`;
