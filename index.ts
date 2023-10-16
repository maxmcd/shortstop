import { z } from "zod";

type AmpHours = Number;
type Volts = Number;
type ThingArgs = { size: Size };


const size = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
});
type Size = z.infer<typeof size>;

const thing = z.object({
  size: z.optional(size),
});

type Thing = z.infer<typeof thing>;

export function CreateThing(data: Thing) {
  return {
    ...thing.parse(data),
    getFullName: function (this: Thing) {
      return `${this.size?.length}`;
    },
  };
}

const volts = z.number().positive({"message": "Voltage must be positive"});
const ampHours = z.number().positive();
const amps = z.number().positive();
const watts = z.number().positive();

const battery = z
  .object({
    voltage: volts,
    capacity: ampHours,
  })
  .merge(thing);

type Battery = z.infer<typeof battery>;

export function CreateBattery(data: Battery) {
  return {
    ...thing.parse(data),
    getFullName: function (this: Battery) {
      return `${this.size?.length}`;
    },
  };
}


const inverter = z
  .object({
    dcVoltage: volts,
    acVoltage: volts,
    watts: z.number().positive(),
  })
  .merge(thing);


const chargeController = z
  .object({
    voltage: volts,
    amps: amps,
    watts: watts,
  })
  .merge(thing);

  const solarPanel = z.object({
    voltage: volts,
    maximumPower: watts,
    maximumVoltage: volts,
  }).merge(thing);


  type SolarPanel = z.infer<typeof solarPanel>;

export function CreateSolarPanel(data: SolarPanel) {
  return {
    ...solarPanel.parse(data),
    maximumPowerCurrent: function (this: SolarPanel) {
      return this.maximumPower / this.maximumVoltage;
    },
  };
}


let panel = CreateSolarPanel({voltage: 12, maximumPower: 100, maximumVoltage: 18.6})
console.log(panel.maximumPowerCurrent())

