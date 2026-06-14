import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom Scalar Date type",
  serialize(value) {
    // Serialize Outgoing Date value to time-INT (milliseconds since midnight, January 1, 1970 UTC.)
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error("Date-Scalar expected a Date Object but Unknown is given");
  },
  parseValue(value) {
    // Convert incoming Milliseconds into Date Object
    if (typeof value === "number") {
      return new Date(value);
    }
    throw new Error("Date-Scalar expected a number but UNKNOWN is given");
  },
  parseLiteral(ast) {
    // Convert incoming hard-coded AST string to integer then to Date Object
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export default dateScalar;
