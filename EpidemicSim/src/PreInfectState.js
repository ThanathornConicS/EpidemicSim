class PreInfectState
{
    constructor()
    {
        if(this.constructor == PreInfectState)
            throw new Error("Abstract classes can't be instantiated.");

        this.FLV_NAME = Object.freeze
        ({
            FZ_SET_PROTECTION: 0,
            FZ_SET_EXPOSURE: 1,
            FZ_SET_POSSIBILITY: 2,
        });
        const FZ_SET_PROTECTION = Object.freeze
        ({
            LOW: 0,
            NORMAL: 1,
            HIGH: 2,
        });
        const FZ_SET_EXPOSURETIME = Object.freeze
        ({
            SHORT: 0,
            MEDUIM: 1,
            LONG: 2,
        });
        const FZ_SET_POSSIBILITY = Object.freeze
        ({
            IMPOSSIBLE: 0,
            LIKELY: 1,
            GUARANTEE: 2,
        });
        this.fuzzyModule = new FuzzyModule();
    }

    InitFuzzy()
    {
        throw new Error("Abstract Method has no implementation");
    }
    GetDesirability (protectionFactor, exposureFactor)
    {
		this.fuzzyModule.Fuzzification (this.FLV_NAME.FZ_SET_PROTECTION.ToString ("F"), protectionFactor);
		this.fuzzyModule.Fuzzification (this.FLV_NAME.FZ_SET_EXPOSURE.ToString ("F"), exposureFactor);

		this.fuzzyModule.ApplyRules();

		return this.fuzzyModule.Defuzzification (	this.FLV_NAME.FZ_SET_POSSIBILITY.ToString ("F"));
	}
}