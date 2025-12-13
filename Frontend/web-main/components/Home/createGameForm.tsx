import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const Creategameform=()=>{
    return (
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold uppercase tracking-wide">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Invite Players
              </span>
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Enter player details to start your multiplayer battle
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerEmail">Player Email</Label>
              <Input
                id="playerEmail"
                type="email"
                placeholder="friend@example.com"
                {...register("playerEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={errors.playerEmail ? "border-destructive" : ""}
              />
              {errors.playerEmail && <p className="text-sm text-destructive">{errors.playerEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPlayers">Total Number of Players</Label>
              {/* <Select onValueChange={(value) => setValue("totalPlayers", value)} defaultValue="">
                <SelectTrigger id="totalPlayers" className={errors.totalPlayers ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                </SelectContent>
              </Select> */}
              <input
                type="hidden"
                {...register("totalPlayers", {
                  required: "Please select number of players",
                })}
              />
              {errors.totalPlayers && <p className="text-sm text-destructive">{errors.totalPlayers.message}</p>}
            </div>

            {totalPlayers && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm text-muted-foreground mb-2">Game Configuration:</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{totalPlayers} Players</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary">
                Send Invite
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
}