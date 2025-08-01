
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: {
    url: string;
    alt?: string;
  };
  defaultVariant?: ProductVariant;
  variants?: ProductVariant[];
  media?: ProductMedia[];
  attributes?: ProductAttribute[];
  category?: Category;
  isAvailableForPurchase: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  pricing?: {
    price?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
    priceUndiscounted?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  attributes?: VariantAttribute[];
}

export interface ProductMedia {
  id: string;
  url: string;
  alt?: string;
  type: string;
}

export interface ProductAttribute {
  attribute: {
    id: string;
    name: string;
  };
  values: {
    id: string;
    name: string;
  }[];
}

export interface VariantAttribute {
  attribute: {
    id: string;
    name: string;
  };
  values: {
    id: string;
    name: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  inputType: string;
  choices?: {
    edges: {
      node: {
        id: string;
        name: string;
        slug: string;
      };
    }[];
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      slug: string;
      thumbnail?: {
        url: string;
      };
    };
    pricing?: {
      price: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
}

export interface Checkout {
  id: string;
  token: string;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  subtotalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  shippingPrice?: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  lines: CartItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  availableShippingMethods?: ShippingMethod[];
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  city: string;
  countryArea: string;
  postalCode: string;
  country: {
    code: string;
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
}

export interface User {
  email: string;
  isStaff: boolean;
  userPermissions: {
    code: string;
  }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface CartState {
  checkoutId: string | null;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  loadCheckout: () => Promise<void>;
}
