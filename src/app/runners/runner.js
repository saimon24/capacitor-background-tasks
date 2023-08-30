// Make a fetch request to the randomuser API and reutrn first user
addEventListener('fetchTest', async (resolve, reject, args) => {
  try {
    const res = await fetch('https://randomuser.me/api/');

    if (!res.ok) {
      throw new Error('Could not fetch user');
    }

    const result = await res.json();
    resolve(result['results'][0]);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Trigger a local notification
addEventListener('notificationTest', async (resolve, reject, args) => {
  try {
    let scheduleDate = new Date();
    scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);

    CapacitorNotifications.schedule([
      {
        id: 42,
        title: 'Background Magic 🧙‍♂️',
        body: 'This comes from the background runner',
        scheduleAt: scheduleDate,
      },
    ]);

    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Save a value to the Capacitor KV store
addEventListener('testSave', async (resolve, reject, args) => {
  try {
    CapacitorKV.set('foo', 'my bar 42');

    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Get a value from the Capacitor KV store
addEventListener('testLoad', async (resolve, reject, args) => {
  try {
    const value = CapacitorKV.get('foo');

    resolve(value);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Save a time and location object in the Capacitor KV store
addEventListener('checkIn', async (resolve, reject, args) => {
  try {
    console.log('checkIn event fired');
    const { value } = CapacitorKV.get('CHECKINS');

    // Gather some data
    const time = new Date().getTime();
    const location = await CapacitorGeolocation.getCurrentPosition();

    // Create an array of checkins
    let checkinArr = [{ location, time }];

    // Try to append our data to the existing array
    try {
      const parsedArr = JSON.parse(value);
      checkinArr = [...parsedArr, { location, time }];
    } catch (e) {
      console.log('no checkins');
    }

    console.log(checkinArr);
    // Save the array
    CapacitorKV.set('CHECKINS', JSON.stringify(checkinArr));

    console.log('checkin saved');
    // Resolve the event call
    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Get all checkins from the Capacitor KV store
addEventListener('loadCheckins', (resolve, reject, args) => {
  try {
    const { value } = CapacitorKV.get('CHECKINS');

    try {
      const arr = JSON.parse(value);
      resolve(arr);
    } catch (e) {
      resolve([]);
    }
  } catch (err) {
    console.error(err);
    reject([]);
  }
});
