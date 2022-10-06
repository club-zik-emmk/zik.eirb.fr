import {createStore} from "vuex";

const store = createStore({
    state() {
        return {
            eventAnchor: null,
            innerPadding: -1,
            isWeekListOpen: false,
        }
    },
    mutations: {
        setEventAnchor(state, anchor) {
            state.eventAnchor = anchor;
        },
        setInnerPadding(state, padding) {
            state.innerPadding = padding;
        },
        openWeekList(state) {
            state.isWeekListOpen = true;
        },
        closeWeekList(state) {
            state.isWeekListOpen = false;
        }
    },
    actions: {
        setEventAnchor({commit}, anchor) {
            commit("setEventAnchor", anchor);
        },
        setInnerPadding({commit}, padding) {
            commit("setInnerPadding", padding);
        },
        openWeekList({commit}) {
            commit("openWeekList");
        },
        closeWeekList({commit}) {
            commit("closeWeekList");
        },
        resetPositions({commit}) {
            commit("setEventAnchor", null);
            commit("setInnerPadding", -1);
        }
    }
});

export default store;