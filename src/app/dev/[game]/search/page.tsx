import { getGameFromParams } from "../../../[game]/getGameFromParams";
import { SearchModalDeveloperStandalone } from "../../../components/search/SearchModal";

export { generateStaticParams } from '../../../[game]/page';

export default async function SearchDevPage(props: PageProps<'/dev/[game]/search'>) {
	const {game} = getGameFromParams(await props.params);
	return <SearchModalDeveloperStandalone game={game} />;
}
