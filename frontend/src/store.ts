import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

const ls = new SecureLS({
    encodingType: "aes",
    isCompression: false,
    encryptionSecret: "d3f4ultS3cr3t",
});

const store = createStore({
    state() {
        return {
            eventAnchor: null,
            innerPadding: -1,
            isWeekListOpen: false,
            currentDay: {
                disponibilities: [],
                reservations: [],
                dayIndex: -1,
                dayName: "",
            },
            user: {
                id: "",
                admin: false,
                member: false
            }
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
        },
        setCurrentDay(state, day) {
            state.currentDay = day;
        },
        setUser(state, user) {
            state.user = user;
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
        },
        setCurrentDay({commit}, day) {
            commit("setCurrentDay", day);
        },
        resetCurrentDay({commit}) {
            commit("setCurrentDay", {
                disponibilities: [],
                reservations: [],
                dayIndex: -1,
                dayName: "",
            });
        },
        isCurrentDaySet({state}) {
            return state.currentDay.dayIndex !== -1;
        },
        isUserSet({state}) {
            return state.user.id !== '';
        },
        setUser({commit}, user) {
            commit("setUser", user);
        },
        resetUser({commit}) {
            commit("setUser", {
                id: "",
                admin: false,
                member: false
            });
        }
    },
    plugins: [createPersistedState({
        storage: {
            getItem: key => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: key => ls.remove(key)
        }
    })]
});

export default store;