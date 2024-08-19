export default class DependencyAnalyser {
  extractDependencies(formula: string): string[] {
    const regex = /\$[rh]\.[a-zA-Z_]\w*/g;
    const matches = formula.match(regex) || [];
    // Extract unique dependencies
    return matches;
  }
}
