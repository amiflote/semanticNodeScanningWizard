import APP_CONFIG from '../../app.config';

export enum NodeType {
  ConceptoPrincipal,
  Concepto,
  LiteralVacio,
  LiteralRelleno,
  InstanceCount,
  Instance,
  SinExplorar
}

export enum NodeState {
  Nuevo,
  Expandido,
  Oculto
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
  displayName = () => {
    let dn;
    this.type == NodeType.SinExplorar || this.type == NodeType.LiteralVacio ? dn = '' : dn = this.label[0].toUpperCase() + this.label.substr(1).toLowerCase();//.substring(1, this.label.indexOf('@')-1);
    return dn;
  };
  linkCount: number = 0;
  type: NodeType;
  state: NodeState;
  label: string;

  constructor(id, type: NodeType, name, label: string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.state = NodeState.Nuevo;
    this.label = label;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get r() {
    let r;
    this.type == NodeType.SinExplorar ? r = 10 : r = 30;
    return r; //* this.normal() + 10;
  }

  get fontSize() {
    return (1 * this.normal() + 10) + 'px';
  }

  get color() {
    //let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[this.type];
  }
}
