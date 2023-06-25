import { Octopus } from "../shared/Octopus";
const debug = require("debug")("smart-home:octopus");

export default class {
  power: string | number;

  constructor() {
    this.power = "waiting for data";
    setInterval(this.poll.bind(this), 1000);
  }

  async poll() {
    console.log("loop");
    try {
      const url =
        "http://192.168.0.176:8123/api/states/sensor.octopus_energy_electricity_21l4161923_1012954708140_current_demand";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhMTJlODRmNDJjZWQ0ZWNjOGZhYzExNTJhZjViYTNiMyIsImlhdCI6MTY4NzcxMDUxOSwiZXhwIjoyMDAzMDcwNTE5fQ.-amPDFpE0Pw_s3BfHoKyo5AlDFaAME6bCFUi_HIO5x8",
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      this.power = Number(((json as any) as { state: Number }).state);
    } catch (e) {
      this.power = String(e);
    }
    debug("loop", this.power);
  }

  getData(): Octopus {
    return {
      power: this.power,
    };
  }
}
