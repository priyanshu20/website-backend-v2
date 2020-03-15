const kue = require("../config/Scheduler/kue");
const worker = require("../config/Scheduler/worker");

const ObjectId = require("mongoose").Types.ObjectId;

// import http status codes
const { BAD_REQUEST, NOT_ACCEPTABLE } = require("../utility/statusCodes");
// import constants
const { USER_HASH_LENGTH, EVENT_HASH_LENGTH } = require("../config/index");
// import helper functions
const {
	sendError,
	sendSuccess,
	generateHash,
	escapeRegex,
	formatHtmlDate
} = require("../utility/helpers");

getPushObject = (part, attendInd) => {
	return {
		id: part._id,
		name: part.name,
		branch: part.branch,
		year: part.year,
		phone: part.phone,
		email: part.email,
		attendance: part.attend[attendInd].attend
	};
};

module.exports.getParticipants = async (req, res) => {
	let { eventId, query, branch, year, sortBy } = req.query;
	let filters = {};

	if (eventId) {
		filters["events.event"] = new ObjectId(eventId);
	}

	if (query) {
		const regex = new RegExp(escapeRegex(query), "gi");
		filters.$or = [{ name: regex }, { email: regex }, { branch: regex }];
	}
	if (branch) {
		filters.branch = branch;
	}
	if (year) {
		filters.year = Number(year);
	}

	let sortObj = {};
	if (sortBy) {
		sortBy.map(sort => {
			if (sort === "createdAt") {
				sortObj[sort] = "desc";
			} else {
				sortObj[sort] = "asc";
			}
		});
	} else {
		sortObj = {
			createdAt: "desc",
			branch: "asc",
			year: "asc",
			name: "asc"
		};
	}

	let participants = await Participant.find(filters).sort(sortObj);
	let data = {
		totalParticipants: participants.length,
		participants
	};
	sendSuccess(res, data);
};

module.exports.registerParticipant = async (req, res) => {
	let { name, email, branch, year, phone } = req.body;
	let participant = await Participant.findOne({
		$or: [
			{ email: { $regex: `^${email}$`, $options: "i" } },
			{
				$and: [
					{ name: { $regex: `^${name}$`, $options: "i" } },
					{ branch },
					{ year },
					{
						$or: [
							{ email: { $regex: `^${email}$`, $options: "i" } },
							{ phone }
						]
					}
				]
			}
		]
	});

	if (participant) {
		sendError(res, "Already Registered!!", BAD_REQUEST);
	} else {
		let password = await generateHash(USER_HASH_LENGTH);
		participant = new Participant({
			name,
			email,
			branch,
			year,
			phone,
			password,
			events: []
		});
		participant = await participant.save();
		let args = {
			jobName: "sendLoginCreds",
			time: Date.now(),
			params: {
				email,
				password,
				name,
				role: "Participant"
			}
		};
		kue.scheduleJob(args);
		sendSuccess(res, participant);
	}
};

module.exports.updateParticipant = async (req, res) => {
	let { name, email, branch, year, phone } = req.body;
	let updateObj = {
		name,
		email,
		branch,
		year,
		phone
	};
	participant = await Participant.findByIdAndUpdate(
		req.params.id,
		{ $set: updateObj },
		{ new: true }
	);
	if (participant) {
		sendSuccess(res, participant);
	} else {
		sendError(res, "Participant not found!!", BAD_REQUEST);
	}
};

module.exports.participantLogin = async (req, res) => {
	let { email, password } = req.body;
	let participant = await Participant.findOne({
		email: { $regex: `^${email}$`, $options: "i" }
	});
	if (!participant) return sendError(res, "Invalid User", NOT_ACCEPTABLE);
	const validPassword = await participant.isValidPwd(String(password).trim());
	if (!validPassword)
		return sendError(res, "Invalid Password", NOT_ACCEPTABLE);
	const token = participant.generateAuthToken();
	sendSuccess(res, participant, token);
};

module.exports.registerForEvent = async (req, res) => {
	let { eventId } = req.body;
	if (!eventId) {
		return sendError(res, "Invalid Event!!", BAD_REQUEST);
	}

	let [participant, event] = await Promise.all([
		Participant.findById(req.user.id),
		Event.findById(eventId)
	]);

	if (!participant || !event) {
		return sendError(res, "Invalid Request!!", BAD_REQUEST);
	}

	let eventIndex = participant.events
		.map(evnt => {
			return String(evnt.event);
		})
		.indexOf(String(eventId));

	if (eventIndex !== -1) {
		return sendError(res, "Already Registered!!", BAD_REQUEST);
	}

	let attendance = new Attendance({
		participant: new ObjectId(req.user.id),
		event: new ObjectId(eventId),
		attend: []
	});

	participant.events.push({
		event: new ObjectId(eventId),
		attendance: new ObjectId(attendance._id),
		status: "not attended"
	});
	[participant, attendance] = await Promise.all([
		participant.save(),
		attendance.save()
	]);
	sendSuccess(res, event);
};

module.exports.participantData = async (req, res) => {
	let matchObj = {};

	if (req.user.role === "participant") {
		matchObj._id = new ObjectId(req.user.id);
	} else if (req.query.participantId) {
		matchObj._id = new ObjectId(req.query.participantId);
	} else {
		return sendError(res, "Invalid Request!!", BAD_REQUEST);
	}

	let [participant] = await Participant.aggregate([
		{
			$match: matchObj
		},
		{
			$lookup: {
				from: "events",
				localField: "events.event",
				foreignField: "_id",
				as: "eventsList"
			}
		},
		{
			$project: {
				"eventsList.title": 1,
				"eventsList.description": 1,
				"eventsList.img": 1,
				"eventsList.days": 1,
				"eventsList.startDate": 1,
				"eventsList.endDate": 1,
				"eventsList.venue": 1,
				"eventsList.time": 1,
				"eventsList._id": 1,
				events: 1,
				name: 1,
				email: 1,
				branch: 1,
				year: 1,
				phone: 1
			}
		}
	]);

	if (!participant) {
		return sendError(res, "Participant not found!!", BAD_REQUEST);
	}

	let profileData = {
		name: participant.name,
		email: participant.email,
		branch: participant.branch,
		year: participant.year,
		phone: participant.phone
	};

	let eventsArray = [];
	participant.events.map(event => {
		let eventListIndex = participant.eventsList
			.map(ev => {
				return String(ev._id);
			})
			.indexOf(String(event.event));
		eventsArray.push({
			...event,
			details: participant.eventsList[eventListIndex]
		});
	});

	let data = {
		profileData,
		events: eventsArray
	};

	sendSuccess(res, data);
};

module.exports.getEvents = async (req, res) => {
	let events = await Event.find().sort({ createdAt: "desc" });
	sendSuccess(res, events);
};

module.exports.addEvent = async (req, res) => {
	let {
		title,
		description,
		days,
		startDate,
		endDate,
		time,
		venue,
		isRegistrationRequired,
		isRegistrationOpened
	} = req.body;

	let code = generateHash(EVENT_HASH_LENGTH);

	let event = new Event({
		title,
		description,
		days,
		startDate: formatHtmlDate(startDate).toISOString(),
		endDate: formatHtmlDate(endDate).toISOString(),
		time,
		venue,
		isRegistrationOpened,
		isRegistrationRequired,
		code
	});
	event = await event.save();
	sendSuccess(res, event);
};

module.exports.changeEventCode = async (req, res) => {
	let { id } = req.body;
	let event = await Event.findById(id);
	if (event) {
		event.code = generateHash(EVENT_HASH_LENGTH);
		event = await event.save();
		sendSuccess(res, event);
	} else {
		sendError(res, "Invalid Event!!", BAD_REQUEST);
	}
};

module.exports.changeEventRegistrationOpen = async (req, res) => {
	let { id } = req.body;
	let event = await Event.findById(id);
	if (event) {
		event.isRegistrationOpen = event.isRegistrationOpen ? false : true;
		event = await event.save();
		sendSuccess(res, event);
	} else {
		sendError(res, "Invalid Event!!", BAD_REQUEST);
	}
};

module.exports.updateEvent = async (req, res) => {
	let { id } = req.params;
	let event = await Event.findById(id);
	if (event) {
		let {
			title,
			description,
			days,
			startDate,
			endDate,
			time,
			venue,
			isRegistrationRequired,
			isRegistrationOpened
		} = req.body;

		let updateObj = {
			title,
			description,
			days,
			startDate: formatHtmlDate(startDate).toISOString(),
			endDate: formatHtmlDate(endDate).toISOString(),
			time,
			venue,
			isRegistrationOpened,
			isRegistrationRequired
		};
		let event = await Event.findByIdAndUpdate(id, updateObj, { new: true });
		sendSuccess(res, event);
	} else {
		sendError(res, "Invalid Event!!", BAD_REQUEST);
	}
};

module.exports.deleteEvent = async (req, res) => {
	let { id } = req.params;
	let event = await Event.findById(id);
	if (event) {
		let args = {
			jobName: "deleteEvent",
			time: Date.now(),
			params: {
				eventId: new ObjectId(event._id)
			}
		};
		kue.scheduleJob(args);
		sendSuccess(res, null);
	} else {
		sendError(res, "Invalid Event!!", BAD_REQUEST);
	}
};

module.exports.getEventAttendanceReport = async (req, res) => {
	let { event, query, branch, year, presentOn, sortBy } = req.query;
	let partFilters = {
		"events.event": new ObjectId(event)
	};

	if (query) {
		const regex = new RegExp(escapeRegex(query), "gi");
		partFilters.$or = [
			{ name: regex },
			{ email: regex },
			{ branch: regex }
		];
	}
	if (branch) {
		partFilters.branch = branch;
	}
	if (year) {
		partFilters.year = Number(year);
	}

	let sortObj = {};
	if (sortBy) {
		sortBy.map(sort => {
			if (sort === "createdAt") {
				sortObj[sort] = "desc";
			} else {
				sortObj[sort] = "asc";
			}
		});
	} else {
		sortObj = {
			createdAt: "desc",
			branch: "asc",
			year: "asc",
			name: "asc"
		};
	}

	let participants = await Participant.aggregate([
		{
			$match: partFilters
		},
		{
			$lookup: {
				from: "attendances",
				localField: "events.attendance",
				foreignField: "_id",
				as: "attend"
			}
		},
		{
			$lookup: {
				from: "events",
				localField: "events.event",
				foreignField: "_id",
				as: "events"
			}
		}
	]).sort(sortObj);

	let filteredAttendance = [];

	participants.map(part => {
		let attendInd = part.attend
			.map(att => {
				return String(att.event);
			})
			.indexOf(String(event));
		let eventInd = part.events
			.map(evnt => {
				return String(evnt._id);
			})
			.indexOf(String(event));

		let eveDays = part.events[eventInd].days;
		if (presentOn) {
			if (presentOn === "all") {
				if (part.attend[attendInd].attend.length === eveDays) {
					filteredAttendance.push(getPushObject(part, attendInd));
				}
			} else if (presentOn === "none") {
				if (part.attend[attendInd].attend.length === 0) {
					filteredAttendance.push(getPushObject(part, attendInd));
				}
			} else {
				let day = formatHtmlDate(presentOn).toISOString();
				part.attend[attendInd].attend.map(att => {
					if (new Date(att).toISOString() === day) {
						filteredAttendance.push(getPushObject(part, attendInd));
					}
				});
			}
		} else {
			filteredAttendance.push(getPushObject(part, attendInd));
		}
	});
	sendSuccess(res, filteredAttendance);
};

module.exports.getEventAttendanceStats = async (req, res) => {
	// total registrations
	// total present day wise
	// present 0 days
	// present all days

	let { event } = req.query;
	let filter = { event: new ObjectId(event) };
	let [
		totalRegistrations,
		present0days,
		presentAlldays,
		eventDetail
	] = await Promise.all([
		Attendance.countDocuments(filter),
		Participant.countDocuments({
			events: {
				$elemMatch: {
					event: new ObjectId(event),
					status: "not attended"
				}
			}
		}),
		Participant.countDocuments({
			events: {
				$elemMatch: { event: new ObjectId(event), status: "attended" }
			}
		}),
		Event.findById(event)
	]);

	if (!event) {
		return sendError(res, "Invalid Event!!", BAD_REQUEST);
	}

	let eveDays = eventDetail.days;

	let dayWiseQueryArray = [],
		i;

	for (let i = 0; i < eveDays; i++) {
		dayWiseQueryArray.push(
			Attendance.countDocuments({
				...filter,
				attend: new Date(
					new Date(eventDetail.startDate).getTime() +
						i * 24 * 60 * 60 * 1000
				).toISOString()
			})
		);
	}

	let dayWiseAttendance = await Promise.all(dayWiseQueryArray);

	let data = {
		totalRegistrations,
		present0days,
		presentAlldays,
		dayWiseAttendance: dayWiseAttendance.slice(0, eveDays)
	};
	return sendSuccess(res, data);
};

module.exports.markUserAttendance = async (req, res) => {
	let { code } = req.body; // event code
	if (!code) {
		return sendError(res, "No Code Received!!", BAD_REQUEST);
	}
	let [event, participant] = await Promise.all([
		Event.findOne({ code }),
		Participant.findById(req.user.id)
	]);
	if (!event) {
		return sendError(res, "Invalid Code!!", BAD_REQUEST);
	}
	let attendance = await Attendance.findOne({
		$and: [{ event: event._id }, { participant: req.user.id }]
	});
	if (!attendance) {
		return sendError(res, "Not Registered in this Event!!", BAD_REQUEST);
	}
	let currTime = new Date(Date.now());
	let today = new Date(
		currTime.getFullYear(),
		currTime.getMonth(),
		currTime.getDate()
	).toISOString();

	if (
		today < new Date(event.startDate).toISOString() ||
		today > new Date(event.endDate).toISOString()
	) {
		return sendError(
			res,
			"Invalid date! Not within event timeline",
			BAD_REQUEST
		);
	}

	let attendIndex = attendance.attend
		.map(attend => {
			return new Date(attend).toISOString();
		})
		.indexOf(today);

	if (attendIndex !== -1) {
		sendError(res, "Already Marked!!", BAD_REQUEST);
	} else {
		attendance.attend.push(today);
		let eventInd = participant.events
			.map(event => {
				return String(event.event);
			})
			.indexOf(String(event._id));
		let daysPresent = attendance.attend.length;
		if (daysPresent < event.days) {
			participant.events[eventInd].status = "partially attended";
		} else {
			participant.events[eventInd].status = "attended";
		}
		await Promise.all([attendance.save(), participant.save()]);
		sendSuccess(res, null);
	}
};

module.exports.getUserEventAttendance = async (req, res) => {
	let { event, attendance } = req.query;
	let [events, attendances] = await Promise.all([
		Event.findById(event),
		Attendance.findById(attendance)
	]);

	if (!events || !attendances) {
		return sendError(res, "Invalid Request!!", BAD_REQUEST);
	}

	let data = {
		event: events,
		attendance: attendances.attend
	};

	return sendSuccess(res, data);
};
