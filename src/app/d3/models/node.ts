import APP_CONFIG from '../../app.config';

export enum NodeType {
  Concepto,
  Expansible
}

export enum NodeState {
  Nuevo,
  Expandido
}

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  name: string;
  displayName: string;
  linkCount: number = 0;
  type: NodeType;
  state: NodeState;

  constructor(id, type: NodeType, name?) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.state = NodeState.Nuevo;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get r() {
    return 30; //* this.normal() + 10;
  }

  get fontSize() {
    return (1 * this.normal() + 10) + 'px';
  }

  get color() {
    //let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[this.type];
  }
}
