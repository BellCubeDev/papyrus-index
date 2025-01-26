import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PapyrusSourceType } from "../../../papyrus/data-structures/pure/scriptSource";
import { faGear, faHandshake, faHandSparkles, faIceCream, faScroll, faWandSparkles } from "@fortawesome/free-solid-svg-icons";

export function SourceIcon({sourceType}: {readonly sourceType: PapyrusSourceType}) {
    switch (sourceType) {
        case PapyrusSourceType.Vanilla:
            return <FontAwesomeIcon icon={faIceCream} />;
        case PapyrusSourceType.xSE:
            return <FontAwesomeIcon icon={faGear} />;
        case PapyrusSourceType.PapyrusLib:
            return <FontAwesomeIcon icon={faScroll} />;
        case PapyrusSourceType.xSePluginExtender:
            return <FontAwesomeIcon icon={faWandSparkles} />;
        case PapyrusSourceType.xSePluginIncidental:
            return <FontAwesomeIcon icon={faHandSparkles} />;
        case PapyrusSourceType.Standalone:
            return <FontAwesomeIcon icon={faHandshake} />;
    }
}
