module.exports = {
  age: timestamp => {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const month = today.getUTCMonth() - birthDate.getUTCMonth();

    if ( month < 0 || month == 0 && today.getUTCDate() < birthDate.getUTCDate() )
      age -= 1;

    return age;
  },
  date: timestamp => {
    const date = new Date(timestamp);

    const day = `0${date.getUTCDate()}`.slice(-2);
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const year = date.getUTCFullYear();

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      format: `${day}/${month}/${year}`,
      birthDay: `${day}/${month}`
    };
  }
}
