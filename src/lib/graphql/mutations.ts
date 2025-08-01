
import { gql } from '@apollo/client';

export const TOKEN_CREATE = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      user {
        email
        isStaff
        userPermissions {
          code
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_CREATE = gql`
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
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
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_LINES_ADD = gql`
  mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              name
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
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_LINES_UPDATE = gql`
  mutation CheckoutLinesUpdate($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
    checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_LINE_DELETE = gql`
  mutation CheckoutLineDelete($checkoutId: ID!, $lineId: ID!) {
    checkoutLineDelete(checkoutId: $checkoutId, lineId: $lineId) {
      checkout {
        id
        lines {
          id
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
  mutation CheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
    checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
      checkout {
        id
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
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_BILLING_ADDRESS_UPDATE = gql`
  mutation CheckoutBillingAddressUpdate($checkoutId: ID!, $billingAddress: AddressInput!) {
    checkoutBillingAddressUpdate(checkoutId: $checkoutId, billingAddress: $billingAddress) {
      checkout {
        id
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
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_SHIPPING_METHOD_UPDATE = gql`
  mutation CheckoutShippingMethodUpdate($checkoutId: ID!, $shippingMethodId: ID!) {
    checkoutShippingMethodUpdate(checkoutId: $checkoutId, shippingMethodId: $shippingMethodId) {
      checkout {
        id
        shippingMethod {
          id
          name
          price {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_PAYMENT_CREATE = gql`
  mutation CheckoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_COMPLETE = gql`
  mutation CheckoutComplete($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        status
        number
        total {
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
              name
            }
          }
        }
      }
      confirmationNeeded
      confirmationData
      errors {
        field
        message
      }
    }
  }
`;
