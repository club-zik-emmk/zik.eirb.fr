import db from "./db";
import { initModels, User, Reservation, ReservationUser } from "./models";

async function run() {
    initModels(db);

    const araoult = await User.create({
        id: "araoult",
        firstName: "Antoine",
        lastName: "Raoult",
        group: "info",
        year: 2024,
    });

    console.log(`Created user ${araoult.fullName} with id ${araoult.id} and admin ${araoult.admin}`);

    const resa1 = await araoult.createOwnedReservation({
        startDate: new Date("2022-08-22 18:00:00"),
        endDate: new Date("2022-08-22 20:00:00"),
        title: "Antoine"
    } as Reservation);

    console.log(`Created reservation with id ${resa1.id} and title ${resa1.title} for user ${araoult.fullName} from ${resa1.startDate} to ${resa1.endDate}`)

    await resa1.addMembers([araoult.id, "jchabrier"]);
    const members = await resa1.getMembers();
    console.log(`Reservation ${resa1.title} has ${members.length} members :`);
    for (const member of members) {
        console.log(`- ${member.fullName}`);
    }


    await ReservationUser.destroy({
        where: {
            reservationId: resa1.id,
        }
    });

    await Reservation.destroy({
        where: {
            id: resa1.id
        },
    });

    await araoult.destroy();

    await db.close();
}

run();