import { getGameFromParams } from "../../../[game]/getGameFromParams";
import { SearchModalStandalone } from "../../../components/search/SearchModal";

export { generateStaticParams } from '../../../[game]/page';

export default async function SearchDevPage(props: PageProps<'/dev/[game]/search'>) {
	const {game} = getGameFromParams(await props.params);
	return <SearchModalStandalone game={game} />;
}
