import {
	ActionIcon,
	Center,
	Container,
	Loader,
	Space,
	Table,
	Text,
	TextInput,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid"
import { Pinned } from "tabler-icons-react"
import { PinnedOff } from "tabler-icons-react"

export default function Home() {
	const [countryData, setCountryData] = useState([])
	const [ascending, setAscending] = useState(false)
	const [ascendingPop, setAscendingPop] = useState(true)
	const [searchValue, setSearchValue] = useState("")
	const [pin, setPin] = useState({
		country: {},
		id: "",
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	async function fetchData() {
		try {
			setError(false)
			setLoading(true)
			const response = await fetch(`https://restcountries.com/v3.1/all`)
			const data = await response.json()
			await data.map((country) => {
				setCountryData((prev) => {
					return [
						...prev,
						{
							name: country.name.common,
							capital: country.capital,
							population: country.population.toLocaleString("en-US"),
							flag: country.flag,
							continent: country.continents,
							id:
								country.name.common +
								country.capital +
								country.population +
								Math.floor(Math.random() * 99),
						},
					].sort((a, d) => {
						if (a.name.toUpperCase() < d.name.toUpperCase()) {
							return -1
						}
						if (a.name.toUpperCase() > d.name.toUpperCase()) {
							return 1
						}
						return 0
					})
				})
			})
			setLoading(false)
		} catch (error) {
			console.error(error)
			setError(true)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	function sortAlphabetical() {
		if (ascending) {
			let sorted = countryData.sort((a, d) => {
				if (a.name.toUpperCase() < d.name.toUpperCase()) {
					return -1
				}
				if (a.name.toUpperCase() > d.name.toUpperCase()) {
					return 1
				}
				return 0
			})
			setAscending(false)
			setCountryData([...sorted])
		}
		if (!ascending) {
			let sorted = countryData.sort((a, d) => {
				if (a.name.toUpperCase() < d.name.toUpperCase()) {
					return 1
				}
				if (a.name.toUpperCase() > d.name.toUpperCase()) {
					return -1
				}
				return 0
			})
			setAscending(true)
			setCountryData([...sorted])
		}
	}

	function sortPopulation() {
		if (ascendingPop) {
			let sorted = countryData.sort((a, b) => {
				return (
					Number(a.population.split(",").join("")) -
					Number(b.population.split(",").join(""))
				)
			})
			setAscendingPop(false)
			setCountryData([...sorted])
		}
		if (!ascendingPop) {
			let sorted = countryData.sort((a, b) => {
				return (
					Number(b.population.split(",").join("")) -
					Number(a.population.split(",").join(""))
				)
			})
			setAscendingPop(true)
			setCountryData([...sorted])
		}
	}

	return (
		<Container style={{ marginTop: "5rem" }}>
			<Center>
				<Text
					style={{
						fontSize: "3rem",
						fontWeight: "500",
						fontFamily: "Poppins, sans-serif",
						color: "#222",
					}}
				>
					All Countries
				</Text>
			</Center>
			<Space h="xl" />
			<Space h="xl" />
			<TextInput
				onChange={(e) => {
					setSearchValue(e.target.value.toLowerCase())
				}}
				placeholder="Search"
				size="lg"
			/>
			<Space h="xl" />
			<Center>
				{loading && <Loader />}
				{error && <p>Error! Please try again later.</p>}
			</Center>
			{!loading && (
				<Table
					style={{ fontFamily: "Poppins, sans-serif" }}
					horizontalSpacing="xl"
					verticalSpacing="md"
					fontSize="md"
					striped
					highlightOnHover
				>
					<thead>
						<tr>
							<th></th>
							<th>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "1rem",
									}}
								>
									<span>Country</span>
									<div style={{ cursor: "pointer" }} onClick={sortAlphabetical}>
										{ascending ? (
											<SortAscendingIcon height={25} width={25} />
										) : (
											<SortDescendingIcon height={25} width={25} />
										)}
									</div>
								</div>
							</th>
							<th>Capital</th>
							<th>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "1rem",
									}}
								>
									<span>Population</span>
									<div onClick={sortPopulation}>
										{ascendingPop ? (
											<SortAscendingIcon height={25} width={25} />
										) : (
											<SortDescendingIcon height={25} width={25} />
										)}
									</div>
								</div>
							</th>
							<th>Flag</th>
							<th>Continent</th>
						</tr>
					</thead>
					<tbody>
						{pin.id && (
							<tr>
								<td
									onClick={() => {
										setPin(false)
									}}
								>
									{
										<ActionIcon color={"red"}>
											<PinnedOff size={20} />
										</ActionIcon>
									}
								</td>
								<td>{pin.country.name}</td>
								<td>{pin.country.capital}</td>
								<td>{pin.country.population}</td>
								<td style={{ fontSize: "4rem" }}>{pin.country.flag}</td>
								<td>{pin.country.continent}</td>
							</tr>
						)}

						{countryData &&
							countryData
								.filter(
									(country) =>
										country.name.toLowerCase().includes(searchValue) &&
										country.id !== pin.id
								)
								.map((country) => (
									<tr key={country.id}>
										<td
											onClick={() => {
												setPin(() => {
													return {
														country: country,
														id: country.id,
													}
												})
											}}
										>
											{
												<ActionIcon color={"blue"}>
													<Pinned size={20} />
												</ActionIcon>
											}
										</td>
										<td>{country.name}</td>
										<td>{country.capital}</td>
										<td>{country.population}</td>
										<td style={{ fontSize: "4rem" }}>{country.flag}</td>
										<td>{country.continent}</td>
									</tr>
								))}
					</tbody>
				</Table>
			)}
		</Container>
	)
}
