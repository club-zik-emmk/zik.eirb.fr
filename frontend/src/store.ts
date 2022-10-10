import {createStore} from "vuex";

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
    }
});

export default store;