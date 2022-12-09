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
            },
            lastCacheRefresh: -1,
        }
    },
    mutations: {
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
        },
        setLastCacheRefresh(state, lastCacheRefresh) {
            state.lastCacheRefresh = lastCacheRefresh;
        }
    },
    actions: {
        openWeekList({commit}) {
            commit("openWeekList");
        },
        closeWeekList({commit}) {
            commit("closeWeekList");
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
        },
        setLastCacheRefresh({commit}, lastCacheRefresh) {
            commit("setLastCacheRefresh", lastCacheRefresh);
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