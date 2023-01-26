import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import { Disponibility, Reservation } from "./types";

const ls = new SecureLS({
    encodingType: "aes",
    isCompression: false,
    encryptionSecret: "d3f4ultS3cr3t",
});

type State = {
    isWeekListOpen: boolean,
    currentDay: {
        disponibilities: Disponibility[],
        reservations: Reservation[],
        dayIndex: number,
        dayName: string,
    },
    user: {
        id: string,
        admin: boolean,
        member: boolean
    },
    lastCacheRefresh: number,
    reservationStack: Reservation[],
    route: string,
    bookingDay: object
};

const store = createStore({
    state(): State {
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
            reservationStack: [],
            route: "",
            bookingDay: {}
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
        },
        pushReservationStack(state, reservation: Reservation) {
            state.reservationStack.push(reservation);
        },
        removeReservationById(state, id: number) {
            state.reservationStack = state.reservationStack.filter((reservation) => {
                return reservation.id !== id;
            });
        },
        setRoute(state, route: string) {
            state.route = route;
        },
        setBookingDay(state, bookingDay: object) {
            state.bookingDay = bookingDay;
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
        },
        pushReservationStack({commit}, reservation: Reservation) {
            commit("pushReservationStack", reservation);
        },
        removeReservationById({commit}, id: number) {
            commit("removeReservationById", id);
        },
        setRoute({commit}, route: string) {
            commit("setRoute", route);
        },
        setBookingDay({commit}, bookingDay: object) {
            commit("setBookingDay", bookingDay);
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