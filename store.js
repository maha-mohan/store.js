import { createStore } from 'vuex';

export const store = createStore({
  state: {
    cartItems:[],
    global_discount: null,
  },

  mutations: {
    updateItemInCart(state, payload) {
      let item = payload;
      if (state.cartItems.length > 0) {
        let bool = state.cartItems.some(i => i.id === item.id)
        if (bool) {
          let itemIndex = state.cartItems.findIndex(el => el.id === item.id)
          if (item.quantity == 0 || item.quantity <= 0) {
            state.cartItems.splice(itemIndex, 1);
          }
          else {
            state.cartItems[itemIndex]["quantity"] = item.quantity;
          }
        }
        else {
          state.cartItems.push(item)
        }
      } else {
        state.cartItems.push(item)
      }
      // localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeItemFromCart(state, payload) {
      if (state.cartItems.length > 0) {
        let bool = state.cartItems.some(i => i.id === payload.id)

        if (bool) {
          let index = state.cartItems.findIndex(el => el.id === payload.id)
          if (state.cartItems[index]["quantity"] !== 0) {
            state.cartItems[index]["quantity"] -= 1
          }
          if (state.cartItems[index]["quantity"] === 0) {
            state.cartItems.splice(index, 1);
            // localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

          }
        }
      }
    },
    
    clearCart(state) {
      state.cartItems = [];
      // localStorage.removeItem('cartItems');
    },

    // export const removeItemFromCart = (state, item) => {
    //   state.cartItems = state.cartItems.filter((cartItems) => {
    //     return cartItems.id !== item.item.id;
    //   });
    // };
  },

  getters: {
    totalPrice(state) {
      let total = 0;
      for (const item of state.cartItems) {
        total += item.quantity * item.price;
      }
      return total;
    },

    totalItems(state) {
      return state.cartItems.length;
    },

    priceByItem:(state) => (itemId) => {
      const item = state.cartItems.find((item) => item.id === itemId);
      if (item) {
        return item.quantity * (Math.round(item.price / (1 - state.global_discount * (1/100))) -  Math.round(item.price / (1 - state.global_discount * (1/100))) * (state.global_discount/100));
      }
      return 0;
    },

    countByItem:(state) => (itemId) => {
      const item = state.cartItems.find((item) => item.id === itemId);
      if (item) {
        return item.quantity;
      }
      return 0;
    },

    getOrderItems(state) {
      return state.cartItems;
    },

  },

  actions: {

    updateItemInCart: (context, payload) => {
      context.commit("updateItemInCart", payload)

    },
    removeItem: (context, payload) => {
      context.commit("removeItem", payload)

    },
    initializeCart(context) {
      context.commit('initializeCartItems');
    },

  //   initializeCartItems(state) { // <-- Uncomment this line
  //   const savedCartItems = localStorage.getItem('cartItems');
  //   if (savedCartItems) {
  //     state.cartItems = JSON.parse(savedCartItems);
  //   }
  // },


    clearItem(context) {
      context.commit('clearCart');
    },

    // export const removeItem = ({ commit }, item) => {
    //   commit('removeItemFromCart', item);
    // };
  }

});
store.dispatch('initializeCart');



